import { CheckForm } from '../../components/CheckForm';

export default function CheckEmailScreen() {
  return (
    <CheckForm
      type="email"
      title="Check an Email"
      placeholder="Paste the email content here..."
      senderField
      subjectField
    />
  );
}
