"use client";

import FormList from "views/FormList";
import ProtectedPage from "components/ProtectedPage";

export default function FormListPage() {
  return (
    <ProtectedPage>
      <FormList />
    </ProtectedPage>
  );
}
