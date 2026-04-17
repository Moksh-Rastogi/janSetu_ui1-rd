'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Heart, CreditCard, Wallet, Building2, CheckCircle } from 'lucide-react'
import type { Campaign } from '@/components/donations/donation-card'

interface DonateDialogProps {
  campaign: Campaign | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDonateSuccess?: (campaignId: string, amount: number) => void
}

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000]

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: Wallet, description: 'Pay with UPI apps' },
  { id: 'card', label: 'Card', icon: CreditCard, description: 'Credit/Debit Card' },
  { id: 'netbanking', label: 'Net Banking', icon: Building2, description: 'Bank transfer' },
]

export function DonateDialog({ campaign, open, onOpenChange, onDonateSuccess }: DonateDialogProps) {
  const [step, setStep] = useState<'amount' | 'payment' | 'success'>('amount')
  const [selectedAmount, setSelectedAmount] = useState<number | null>(1000)
  const [customAmount, setCustomAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [isProcessing, setIsProcessing] = useState(false)

  const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`
    }
    return `₹${amount}`
  }

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setSelectedAmount(null)
  }

  const handleProceedToPayment = () => {
    if (finalAmount && finalAmount >= 100) {
      setStep('payment')
    }
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsProcessing(false)
    setStep('success')
    if (campaign && finalAmount) {
      onDonateSuccess?.(campaign.id, finalAmount)
    }
  }

  const handleClose = () => {
    setStep('amount')
    setSelectedAmount(1000)
    setCustomAmount('')
    setPaymentMethod('upi')
    onOpenChange(false)
  }

  if (!campaign) return null

  const progress = Math.min((campaign.amountRaised / campaign.goalAmount) * 100, 100)
  const remainingAmount = Math.max(campaign.goalAmount - campaign.amountRaised, 0)
  const isFullyFunded = remainingAmount === 0
  const isAmountExceedingRemaining = finalAmount ? finalAmount > remainingAmount : false

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            {step === 'success' ? 'Thank You!' : 'Donate to Campaign'}
          </DialogTitle>
        </DialogHeader>

        {step === 'amount' && (
          <div className="space-y-5 pt-2">
            {/* Fully Funded Message */}
            {isFullyFunded && (
              <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <h3 className="font-medium text-green-700 dark:text-green-300">Campaign Fully Funded!</h3>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  This campaign has reached its goal. Thank you for your interest!
                </p>
              </div>
            )}

            {/* Campaign Info */}
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <h3 className="font-medium text-foreground line-clamp-1">{campaign.name}</h3>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Raised</span>
                  <span className="font-medium">{formatCurrency(campaign.amountRaised)} of {formatCurrency(campaign.goalAmount)}</span>
                </div>
                <Progress value={progress} className="h-2" />
                {!isFullyFunded && (
                  <div className="flex justify-between text-sm pt-1">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className="font-medium text-primary">{formatCurrency(remainingAmount)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Preset Amounts */}
            {!isFullyFunded && (
              <div className="space-y-3">
                <Label>Select Amount (Max: {formatCurrency(remainingAmount)})</Label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_AMOUNTS.filter(amount => amount <= remainingAmount).map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? 'default' : 'outline'}
                      className="w-full"
                      onClick={() => handleAmountSelect(amount)}
                    >
                      ₹{amount.toLocaleString()}
                    </Button>
                  ))}
                  <Button
                    variant={customAmount ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => {
                      setSelectedAmount(null)
                      setCustomAmount('')
                    }}
                  >
                    Custom
                  </Button>
                </div>
              </div>
            )}

            {/* Custom Amount Input */}
            {!isFullyFunded && (customAmount !== '' || selectedAmount === null) && (
              <div className="space-y-2">
                <Label htmlFor="customAmount">Enter Amount (₹100 - {formatCurrency(remainingAmount)})</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    id="customAmount"
                    type="number"
                    min="100"
                    max={remainingAmount}
                    placeholder={`Enter amount (max ₹${remainingAmount.toLocaleString()})`}
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="pl-8"
                  />
                </div>
                {isAmountExceedingRemaining && (
                  <p className="text-sm text-destructive">
                    Amount exceeds remaining goal. Maximum donation: {formatCurrency(remainingAmount)}
                  </p>
                )}
              </div>
            )}

            {/* Impact Preview */}
            {!isFullyFunded && finalAmount && finalAmount >= 100 && !isAmountExceedingRemaining && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Your Impact:</span>{' '}
                  {finalAmount >= 5000 
                    ? `Help provide essential supplies for ${Math.floor(finalAmount / 500)} families`
                    : finalAmount >= 1000
                    ? `Contribute to relief efforts for ${Math.floor(finalAmount / 200)} individuals`
                    : 'Every contribution makes a difference!'
                  }
                </p>
              </div>
            )}

            {/* Proceed Button */}
            {isFullyFunded ? (
              <Button className="w-full" onClick={handleClose}>
                Close
              </Button>
            ) : (
              <Button 
                className="w-full" 
                onClick={handleProceedToPayment}
                disabled={!finalAmount || finalAmount < 100 || isAmountExceedingRemaining}
              >
                Continue to Payment
              </Button>
            )}
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-5 pt-2">
            {/* Amount Summary */}
            <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
              <p className="text-sm text-muted-foreground">Donation Amount</p>
              <p className="text-3xl font-bold text-foreground mt-1">₹{finalAmount?.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">to {campaign.name}</p>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      paymentMethod === method.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <method.icon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{method.label}</p>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep('amount')}>
                Back
              </Button>
              <Button 
                className="flex-1" 
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Pay ₹${finalAmount?.toLocaleString()}`}
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="space-y-5 pt-2 text-center">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground">Donation Successful!</h3>
              <p className="text-muted-foreground mt-2">
                Your donation of <span className="font-medium text-foreground">₹{finalAmount?.toLocaleString()}</span> to{' '}
                <span className="font-medium text-foreground">{campaign.name}</span> has been processed.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground">
                A receipt has been sent to your email. Thank you for your generosity!
              </p>
            </div>

            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <Heart className="h-3 w-3 mr-1" />
              You&apos;re making a difference!
            </Badge>

            <Button className="w-full" onClick={handleClose}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
