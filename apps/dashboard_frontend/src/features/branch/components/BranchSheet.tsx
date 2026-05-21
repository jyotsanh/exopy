import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiGitBranch, FiLoader, FiAlertCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  branchSchema,
  type BranchSchemaType,
} from "../schemas/branch.schema";
import type { BranchForm } from "../types/branch.types";

interface FieldConfig {
  name: keyof BranchSchemaType;
  label: string;
  type: string;
  placeholder: string;
  description: string;
  required: boolean;
}

const FIELDS: FieldConfig[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Branch",
    description: "Enter branch name",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "branch@mail.com",
    description: "Enter branch email",
    required: false,
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    placeholder: "Enter Address",
    description: "Enter location address",
    required: false,
  },
  {
    name: "contact_number",
    label: "Contact Number",
    type: "tel",
    placeholder: "+1 (000) 000-0000",
    description: "Enter contact phone number",
    required: false,
  },
];

const RequiredBadge = ({ required }: { required: boolean }) =>
  required ? (
    <span
      className="text-xs font-medium text-rose-500 bg-rose-50
                 border border-rose-100 px-2 py-0.5 rounded-full
                 dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-300"
    >
      Required
    </span>
  ) : (
    <span
      className="text-xs font-medium text-muted-foreground bg-muted
                 border border-border px-2 py-0.5 rounded-full"
    >
      Optional
    </span>
  );

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-1.5 mt-1.5">
      <FiAlertCircle className="text-rose-500 text-xs shrink-0" />
      <p className="text-xs text-rose-500 font-medium">{message}</p>
    </div>
  );
};

interface BranchSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
  onSubmit: (data: BranchForm) => void;
  onCancel: () => void;
}

const BranchSheet = ({
  open,
  onOpenChange,
  isSubmitting,
  onSubmit,
  onCancel,
}: BranchSheetProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<BranchSchemaType>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      contact_number: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => reset(), 300);
      return () => clearTimeout(timeout);
    }
  }, [open, reset]);

  const onFormSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 border-l border-border bg-card"
      >
        <SheetHeader className="px-8 pt-8 pb-6 border-b border-border">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100
                         dark:bg-teal-950/40 dark:border-teal-900/60
                         flex items-center justify-center"
            >
              <FiGitBranch className="text-teal-600 dark:text-teal-300 text-lg" />
            </div>
            <div>
              <SheetTitle className="text-lg font-bold tracking-widest uppercase text-teal-700 dark:text-teal-300">
                Register Branch
              </SheetTitle>
              <SheetDescription className="text-muted-foreground text-sm mt-0.5">
                Setup a new branch
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={onFormSubmit} className="flex flex-col h-[calc(100%-88px)]">
          <div className="px-8 py-7 space-y-6 overflow-y-auto flex-1">
            {FIELDS.map((field) => {
              const fieldError = errors[field.name];
              const hasError = !!fieldError;

              return (
                <div key={field.name} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor={field.name}
                      className="text-sm font-semibold text-foreground"
                    >
                      {field.label}
                    </label>
                    <RequiredBadge required={field.required} />
                  </div>

                  <p className="text-xs text-muted-foreground">{field.description}</p>

                  <Input
                    id={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    {...register(field.name)}
                    aria-invalid={hasError}
                    aria-describedby={
                      hasError ? `${field.name}-error` : undefined
                    }
                    className={`h-11 rounded-xl bg-muted/40 text-foreground
                               placeholder:text-muted-foreground transition-colors
                               ${
                                 hasError
                                   ? "border-rose-300 dark:border-rose-700 focus-visible:ring-rose-400 focus-visible:border-rose-400"
                                   : "border-border focus-visible:ring-teal-400 focus-visible:border-teal-300"
                               }`}
                  />

                  {hasError && (
                    <div id={`${field.name}-error`} role="alert">
                      <FieldError message={fieldError?.message} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <SheetFooter
            className="px-8 py-6 border-t border-border
                       flex flex-row gap-3 justify-end"
          >
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="h-11 px-6 rounded-xl border-border
                         text-foreground hover:bg-accent"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || !isValid || !isDirty}
              className="h-11 px-6 rounded-xl bg-primary text-white
                         shadow-md hover:bg-primary/90 gap-2 min-w-40"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="animate-spin text-base" />
                  Adding…
                </>
              ) : (
                "Add Branch"
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default BranchSheet;
