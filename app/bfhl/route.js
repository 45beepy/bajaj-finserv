import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ operation_code: 1 }, { status: 200 });
}

export async function POST(req) {
  try {
    const { data, file_b64 } = await req.json();
    const file_valid = file_b64 === "BASE_64_STRING" ? true : false;
    console.log(file_b64);
    const user_id = "pravin_bp_abcd123";
    const email = "pp1211@srmist.edu.in";
    const roll_number = "RA2111033010095";

    const numbers = data
      .filter((item) => !isNaN(item) && item.trim() !== "")
      .map((item) => Number(item));
    const alphabets = data.filter(
      (item) => typeof item === "string" && /^[a-zA-Z]+$/.test(item),
    );

    const uniqueAlphabets = [
      ...new Set(alphabets.filter((item) => /^[a-z]+$/.test(item))),
    ].sort((a, b) => a.localeCompare(b));
    const highest_lowercase_alphabet =
      uniqueAlphabets.length > 0
        ? [uniqueAlphabets[uniqueAlphabets.length - 1]]
        : [];

    return NextResponse.json(
      {
        is_success: true,
        user_id,
        email,
        roll_number,
        alphabets,
        numbers,
        highest_lowercase_alphabet,
        file_valid,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error", error: err },
      { status: 500 },
    );
  }
  return NextResponse.json({ data }, { status: 200 });
}
