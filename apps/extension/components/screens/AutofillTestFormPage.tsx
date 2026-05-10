import { AutofillTestFormIntro } from "@/components/autofill-test/AutofillTestFormIntro";
import { AutofillTestSampleApplicationCard } from "@/components/autofill-test/AutofillTestSampleApplicationCard";

export function AutofillTestFormPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground">
      <div className="page-wrap @container">
        <AutofillTestFormIntro />
        <AutofillTestSampleApplicationCard />
      </div>
    </div>
  );
}
