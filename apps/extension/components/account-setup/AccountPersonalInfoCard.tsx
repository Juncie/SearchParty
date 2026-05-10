import type { AccountSetup } from "@searchparty/shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AccountPersonalInfoCardProps {
  setup: AccountSetup;
  onSetupChange: (next: AccountSetup) => void;
}

export function AccountPersonalInfoCard({
  setup,
  onSetupChange,
}: AccountPersonalInfoCardProps) {
  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle>Personal information</CardTitle>
        <CardDescription>Your base contact details.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 @sm:grid-cols-2">
          <label className="grid gap-1 text-xs font-semibold">
            First name
            <Input
              value={setup.firstName}
              onChange={(e) =>
                onSetupChange({ ...setup, firstName: e.target.value })
              }
              placeholder="First name"
              autoComplete="given-name"
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold">
            Last name
            <Input
              value={setup.lastName}
              onChange={(e) =>
                onSetupChange({ ...setup, lastName: e.target.value })
              }
              placeholder="Last name"
              autoComplete="family-name"
            />
          </label>
        </div>
        <label className="grid gap-1 text-xs font-semibold">
          Phone
          <Input
            value={setup.phone}
            onChange={(e) =>
              onSetupChange({ ...setup, phone: e.target.value })
            }
            placeholder="+1 ..."
            autoComplete="tel"
          />
        </label>

        <div>
          <p className="mb-2 text-xs font-semibold text-foreground">
            Address
          </p>
          <div className="grid gap-3">
            <label className="grid gap-1 text-xs font-semibold">
              Street
              <Input
                value={setup.addressStreet}
                onChange={(e) =>
                  onSetupChange({
                    ...setup,
                    addressStreet: e.target.value,
                  })
                }
                placeholder="Street address"
                autoComplete="street-address"
              />
            </label>
            <div className="grid gap-3 @sm:grid-cols-2">
              <label className="grid gap-1 text-xs font-semibold">
                State
                <Input
                  value={setup.addressState}
                  onChange={(e) =>
                    onSetupChange({
                      ...setup,
                      addressState: e.target.value,
                    })
                  }
                  placeholder="State / province"
                  autoComplete="address-level1"
                />
              </label>
              <label className="grid gap-1 text-xs font-semibold">
                City
                <Input
                  value={setup.addressCity}
                  onChange={(e) =>
                    onSetupChange({
                      ...setup,
                      addressCity: e.target.value,
                    })
                  }
                  placeholder="City"
                  autoComplete="address-level2"
                />
              </label>
            </div>
            <div className="grid gap-3 @sm:grid-cols-2">
              <label className="grid gap-1 text-xs font-semibold">
                Zip
                <Input
                  value={setup.addressZip}
                  onChange={(e) =>
                    onSetupChange({
                      ...setup,
                      addressZip: e.target.value,
                    })
                  }
                  placeholder="ZIP / postal code"
                  autoComplete="postal-code"
                />
              </label>
              <label className="grid gap-1 text-xs font-semibold">
                Unit
                <Input
                  value={setup.addressUnit}
                  onChange={(e) =>
                    onSetupChange({
                      ...setup,
                      addressUnit: e.target.value,
                    })
                  }
                  placeholder="Apt, suite, unit"
                  autoComplete="address-line2"
                />
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
