const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, content-type, apikey",
      "Access-Control-Allow-Methods": "POST, OPTIONS"
    }
  });

async function supabaseRequest(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type, apikey, x-client-info",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      }
    });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Missing authorization" }, 401);
    }

    const accessToken = authHeader.slice("Bearer ".length);

    const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!userResponse.ok) {
      return json({ error: "Invalid authentication" }, 401);
    }

    const currentUser = await userResponse.json();

    const profileResponse = await supabaseRequest(
      `/rest/v1/profiles?id=eq.${encodeURIComponent(currentUser.id)}&select=id,role`
    );

    if (!profileResponse.ok) {
      return json({ error: "Unable to verify administrator privileges" }, 500);
    }

    const profiles = await profileResponse.json();

    if (profiles[0]?.role !== "Admin") {
      return json({ error: "Administrator access required" }, 403);
    }

    const body = await req.json();
    const { action, id, name, email, role, phone, password } = body;

    if (!["create", "update", "delete"].includes(action)) {
      return json({ error: "Invalid action" }, 400);
    }

    if (action === "create") {
      if (!name || !email || !role || !password) {
        return json({ error: "Name, email, role and password are required" }, 400);
      }

      const createResponse = await supabaseRequest("/auth/v1/admin/users", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          email_confirm: true
        })
      });

      const created = await createResponse.json();

      if (!createResponse.ok) {
        return json({ error: created.msg || created.message || "Failed to create Auth user" }, createResponse.status);
      }

      const profileResponse = await supabaseRequest("/rest/v1/profiles", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          id: created.id,
          name,
          email,
          role,
          phone: phone || null
        })
      });

      if (!profileResponse.ok) {
        await supabaseRequest(`/auth/v1/admin/users/${created.id}`, {
          method: "DELETE"
        });
        const profileError = await profileResponse.text();
        return json({ error: `Failed to create profile: ${profileError}` }, 500);
      }

      const profilesCreated = await profileResponse.json();

      return json({
        success: true,
        user: profilesCreated[0]
      });
    }

    if (!id) {
      return json({ error: "User id is required" }, 400);
    }

    if (action === "delete") {
      if (id === currentUser.id) {
        return json({ error: "You cannot delete your own account" }, 400);
      }

      const deleteResponse = await supabaseRequest(`/auth/v1/admin/users/${encodeURIComponent(id)}`, {
        method: "DELETE"
      });

      if (!deleteResponse.ok) {
        const error = await deleteResponse.text();
        return json({ error: error || "Failed to delete user" }, deleteResponse.status);
      }

      return json({
        success: true,
        message: "Staff user deleted successfully"
      });
    }

    const authUpdates: Record<string, unknown> = {};

    if (email !== undefined) authUpdates.email = email;
    if (password !== undefined && password !== "") authUpdates.password = password;

    if (Object.keys(authUpdates).length > 0) {
      const updateAuthResponse = await supabaseRequest(
        `/auth/v1/admin/users/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          body: JSON.stringify(authUpdates)
        }
      );

      if (!updateAuthResponse.ok) {
        const error = await updateAuthResponse.text();
        return json({ error: error || "Failed to update Auth user" }, updateAuthResponse.status);
      }
    }

    const profileUpdates: Record<string, unknown> = {};
    if (name !== undefined) profileUpdates.name = name;
    if (email !== undefined) profileUpdates.email = email;
    if (role !== undefined) profileUpdates.role = role;
    if (phone !== undefined) profileUpdates.phone = phone || null;

    if (Object.keys(profileUpdates).length > 0) {
      const profileResponse = await supabaseRequest(
        `/rest/v1/profiles?id=eq.${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify(profileUpdates)
        }
      );

      if (!profileResponse.ok) {
        const error = await profileResponse.text();
        return json({ error: error || "Failed to update profile" }, profileResponse.status);
      }

      const profilesUpdated = await profileResponse.json();

      return json({
        success: true,
        user: profilesUpdated[0]
      });
    }

    const profileFetchResponse = await supabaseRequest(
      `/rest/v1/profiles?id=eq.${encodeURIComponent(id)}&select=id,name,email,role,phone,created_at`
    );
    const profilesUpdated = await profileFetchResponse.json();

    return json({
      success: true,
      user: profilesUpdated[0]
    });
  } catch (error) {
    console.error("admin-users error:", error);
    return json({ error: "Internal server error" }, 500);
  }
});
