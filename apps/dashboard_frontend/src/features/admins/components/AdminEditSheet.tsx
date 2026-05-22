import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiUser, FiLoader, FiAlertCircle } from "react-icons/fi";
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
  updateAdminSchema,
  type UpdateAdminSchemaType,
} from "../schemas/admin.schema";
import type { AdminEntity, UpdateAdminForm } from "../types/admin.types";
import type { IOrganization } from "@/store/slice/organization/organization.slice";

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1.5">
      <FiAlertCircle className="text-rose-500 text-xs shrink-0" />
      <p className="text-xs text-rose-500 font-medium">{message}</p>
    </div>
  );
};

const orgIdOf = (org: AdminEntity["org_id"]): string =>
  !org ? "" : typeof org === "string" ? org : org._id;

interface AdminEditSheetProps {
  admin: AdminEntity | null;
  organizations: IOrganization[];
  isSubmitting: boolean;
  onSubmit: (data: UpdateAdminForm) => void;
  onCancel: () => void;
}

const AdminEditSheet = ({
  admin,
  organizations,
  isSubmitting,
  onSubmit,
  onCancel,
}: AdminEditSheetProps) => {
  const open = !!admin;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<UpdateAdminSchemaType>({
    resolver: zodResolver(updateAdminSchema),
    defaultValues: { username: "", email: "", org_id: "" },
    mode: "onTouched",
  });

  useEffect(() => {
    if (admin) {
      reset({
        username: admin.username,
        email: admin.email,
        org_id: orgIdOf(admin.org_id) || undefined,
      });
    }
  }, [admin, reset]);

  const onFormSubmit = handleSubmit((data) => onSubmit(data));

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => (!o ? handleCancel() : null)}>
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
              <FiUser className="text-teal-600 dark:text-teal-300 text-lg" />
            </div>
            <div>
              <SheetTitle className="text-lg font-bold tracking-widest uppercase text-teal-700 dark:text-teal-300">
                Edit Admin
              </SheetTitle>
              <SheetDescription className="text-muted-foreground text-sm mt-0.5">
                Update name, email, or organization
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form
          onSubmit={onFormSubmit}
          className="flex flex-col h-[calc(100%-88px)]"
        >
          <div className="px-8 py-7 space-y-6 overflow-y-auto flex-1">
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="text-sm font-semibold text-foreground"
              >
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                {...register("username")}
                aria-invalid={!!errors.username}
                className="h-11 rounded-xl bg-muted/40 text-foreground border-border"
              />
              <FieldError message={errors.username?.message} />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-foreground"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@email.com"
                {...register("email")}
                aria-invalid={!!errors.email}
                className="h-11 rounded-xl bg-muted/40 text-foreground border-border"
              />
              <FieldError message={errors.email?.message} />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="org_id"
                className="text-sm font-semibold text-foreground"
              >
                Organization
              </label>
              <select
                id="org_id"
                {...register("org_id")}
                className="h-11 w-full px-4 rounded-xl bg-muted/40 text-foreground border border-border outline-none"
              >
                <option value="">— Unchanged —</option>
                {organizations.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.name}
                  </option>
                ))}
              </select>
              <FieldError message={errors.org_id?.message} />
            </div>
          </div>

          <SheetFooter className="px-8 py-6 border-t border-border flex flex-row gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="h-11 px-6 rounded-xl border-border text-foreground hover:bg-accent"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="h-11 px-6 rounded-xl bg-primary text-white shadow-md hover:bg-primary/90 gap-2 min-w-40"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="animate-spin text-base" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AdminEditSheet;
