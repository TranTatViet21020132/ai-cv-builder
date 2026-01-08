"use client";

import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { PlusSquare } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateResumeButtonProps {
  canCreate: boolean;
}

export default function CreateResumeButton({
  canCreate,
}: CreateResumeButtonProps) {
  const premiumModal = usePremiumModal();
  const router = useRouter();

  function handleClick() {
    if (canCreate) {
      router.push("/editor");
    } else {
      premiumModal.setOpen(true);
    }
  }

  return (
    <Button
      onClick={handleClick}
      className="mx-auto flex w-fit gap-2"
      aria-label="Create new resume"
    >
            <PlusSquare className="size-5" />      <span>New resume</span>   {" "}
    </Button>
  );
}
