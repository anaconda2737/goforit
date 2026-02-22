import FormBuilder from "components/FormBuilder";

type ViewFormProps = {
  formId: string;
};

const ViewForm = ({ formId }: ViewFormProps) => {
  return <FormBuilder isView formId={formId} />;
};

export default ViewForm;
