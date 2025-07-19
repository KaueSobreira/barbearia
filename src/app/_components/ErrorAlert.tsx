import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Props {
  message: string;
}

const ErrorAlert: React.FC<Props> = ({ message }) => {
  return (
    <div className="mx-auto mb-4 max-w-md px-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
};

export default ErrorAlert;
