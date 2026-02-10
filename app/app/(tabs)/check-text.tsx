import { CheckForm } from '../../components/CheckForm';

export default function CheckTextScreen() {
  return (
    <CheckForm
      type="text"
      title="Check a Text"
      placeholder="Paste the text message here..."
      senderField
      subjectField={false}
    />
  );
}
