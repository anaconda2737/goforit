"use client";

import ViewForm from "views/ViewForm";
import { useParams } from "next/navigation";

export default function ViewFormPage() {
  const params = useParams<{ formId: string }>();
  const formId = params?.formId || "";

  return <ViewForm formId={formId} />;
}
