export const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const userUrl = `${baseURL}/api/user`;
const formUrl = `${baseURL}/api/form`;
const responseUrl = `${baseURL}/api/response`;
const templateUrl = `${baseURL}/api/template`;

const User = {
  login: `${userUrl}/login`,
  register: `${userUrl}/register`,
};

const Form = {
  getAllForms: `${formUrl}/all`,
  createForm: `${formUrl}/create`,
};

const Response = {
  submitResponse: `${responseUrl}/submit`,
  checkStatus: `${responseUrl}/status`,
};

const Template = {
  getAllTemplate: `${templateUrl}/all`,
};

export { User, Form, Response, Template, formUrl, responseUrl };
