import FormBuilder from "components/FormBuilder";

type EditFormProps = {
  formId: string;
};

const EditForm = ({ formId }: EditFormProps) => {
  return <FormBuilder isEdit formId={formId} />;
};

export default EditForm;
