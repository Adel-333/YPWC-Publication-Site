import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const fullName = formData.get("fullName") as string;
    const school = formData.get("school") as string;
    const email = formData.get("email") as string;
    const grade = formData.get("grade") as string;
    const topic = formData.get("topic") as string;
    const title = formData.get("title") as string;
    const pitch = formData.get("pitch") as string;
    const sourceLink = (formData.get("sourceLink") as string || "").trim();
    const publicationRights = Boolean(formData.get("publicationRights"));
    const file = formData.get("articleFile") as File | null;
    const images = (formData.getAll("articleImage") as File[]).filter(
      (f) => f && f.size > 0
    );

    let fileData = null;
    if (file && file.size > 0) {
      const ext = file.name.split(".").pop() || "pdf";
      const slug = (s: string) =>
        s
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "_")
          .replace(/-+/g, "_")
          .substring(0, 60);
      const cleanTitle = slug(title || "Article");
      const cleanName = slug(fullName || "Author");
      const filename = `${cleanTitle}_${cleanName}.${ext}`;

      const buffer = Buffer.from(await file.arrayBuffer());
      fileData = {
        name: filename,
        type: file.type || `application/${ext === "pdf" ? "pdf" : "msword"}`,
        content: buffer.toString("base64"),
      };
    }

    const slug = (s: string) =>
      s
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "_")
        .replace(/-+/g, "_")
        .substring(0, 60);
    const cleanTitle = slug(title || "Article");
    const cleanName = slug(fullName || "Author");
    const imageData = [];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const ext = img.name.split(".").pop() || "gif";
      const buffer = Buffer.from(await img.arrayBuffer());
      imageData.push({
        name: `${cleanTitle}_${cleanName}_gif${i + 1}.${ext}`,
        type: img.type || "image/gif",
        content: buffer.toString("base64"),
      });
    }

    const payload = {
      fullName,
      school,
      email,
      grade,
      topic,
      title,
      pitch,
      sourceLink,
      publicationRights,
      file: fileData,
      image: imageData,
      driveFolderId: "1eEbOp7OGsz2Cu90gJSdQ6uRn5I0supsp",
      timestamp: new Date().toISOString(),
    };

    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      return NextResponse.json(
        { success: false, error: "Registration endpoint is not configured" },
        { status: 503 }
      );
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error("Apps Script HTTP error:", responseText);
      return NextResponse.json(
        { success: false, error: "Registration endpoint failed" },
        { status: 502 }
      );
    }

    try {
      const result = JSON.parse(responseText) as { success?: boolean; error?: string };
      if (result.success === false) {
        console.error("Apps Script registration error:", result.error);
        return NextResponse.json(
          { success: false, error: "Registration could not be saved" },
          { status: 502 }
        );
      }
    } catch {
      console.error("Apps Script returned non-JSON response:", responseText);
      return NextResponse.json(
        { success: false, error: "Registration endpoint returned an invalid response" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
