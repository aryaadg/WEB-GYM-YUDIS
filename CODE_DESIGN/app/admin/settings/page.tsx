"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, Landmark, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your gym configuration and integrations.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Gateways</CardTitle>
            <CardDescription>Configure how you receive payments from members.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="default" className="bg-muted border-none">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Integration Pending</AlertTitle>
              <AlertDescription>
                Payment gateway integration will be configured later. These are placeholders for future setup.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-dashed">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">Midtrans</span>
                  </div>
                  <CardDescription>Indonesian payment gateway</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" disabled>Configure</Button>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="h-5 w-5 text-purple-500" />
                    <span className="font-semibold">Xendit</span>
                  </div>
                  <CardDescription>Digital payment infrastructure</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" disabled>Configure</Button>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Landmark className="h-5 w-5 text-green-500" />
                    <span className="font-semibold">Bank Transfer</span>
                  </div>
                  <CardDescription>Manual verification</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" disabled>Configure</Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic gym information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="gym-name">Gym Name</Label>
              <Input id="gym-name" defaultValue="DE GYM Platinum" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gym-address">Address</Label>
              <Input id="gym-address" defaultValue="Kuta, Bali, Indonesia" />
            </div>
            <Button className="mt-4">Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}