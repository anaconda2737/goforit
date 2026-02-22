"use client";

import EditForm from "views/EditForm";
import ProtectedPage from "components/ProtectedPage";
import { useParams } from "next/navigation";

export default function EditFormPage() {
  const params = useParams<{ formId: string }>();
  const formId = params?.formId || "";

  return (
    <ProtectedPage>
      <EditForm formId={formId} />
    </ProtectedPage>
  );
}
