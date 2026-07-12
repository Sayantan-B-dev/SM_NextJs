export const dynamic = "force-dynamic";

export default function ErrorTriggerPage() {
  throw new Error("Intentional error triggered from error-trigger page");
}
