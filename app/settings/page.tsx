'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Settings,
  User,
  Bell,
  Shield,
  Building2,
  Camera,
  Mail,
  Smartphone,
  AlertTriangle,
  Key,
  History,
  FileText,
  CheckCircle,
  Clock,
  BadgeCheck,
  Star,
} from 'lucide-react'

// Mock user data
const MOCK_USER = {
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  phone: '+91 98765 43210',
  avatar: '',
  role: 'NGO Admin',
  trustScore: 85,
  isVerified: true,
  organization: {
    name: 'Hope Foundation India',
    type: 'Non-Profit Organization',
    registrationNumber: 'NGO/2020/12345',
    address: '123 Civil Lines, New Delhi, India',
    website: 'www.hopefoundation.org',
    verificationStatus: 'verified',
    documentsSubmitted: 4,
    documentsRequired: 4,
  },
  notifications: {
    emailAlerts: true,
    pushNotifications: true,
    emergencyAlerts: true,
    weeklyDigest: false,
    taskReminders: true,
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: '2025-12-15',
    loginHistory: [
      { date: '2026-04-18 10:30 AM', device: 'Chrome on Windows', location: 'New Delhi, India', status: 'success' },
      { date: '2026-04-17 09:15 AM', device: 'Safari on iPhone', location: 'New Delhi, India', status: 'success' },
      { date: '2026-04-16 02:45 PM', device: 'Chrome on Windows', location: 'Mumbai, India', status: 'success' },
      { date: '2026-04-15 08:00 AM', device: 'Unknown Device', location: 'Unknown', status: 'failed' },
    ],
  },
}

export default function SettingsPage() {
  const [user, setUser] = useState(MOCK_USER)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  })

  const handleNotificationChange = (key: keyof typeof user.notifications) => {
    setUser((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }))
  }

  const handleToggle2FA = () => {
    setUser((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        twoFactorEnabled: !prev.security.twoFactorEnabled,
      },
    }))
  }

  const handleSaveProfile = () => {
    setUser((prev) => ({
      ...prev,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    }))
    setIsEditing(false)
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground text-pretty flex items-center gap-2">
                <Settings className="h-8 w-8 text-primary" />
                Settings
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your account preferences and security
              </p>
            </div>
            {/* Trust Score Badge */}
            <Card className="w-fit">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium text-muted-foreground">Trust Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">{user.trustScore}</span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
                {user.isVerified && (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                    <BadgeCheck className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="organization" className="gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Organization</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and profile photo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                          {user.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.role}</p>
                      <Badge variant="outline" className="mt-2">
                        Member since Jan 2024
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Form Fields */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input value={user.role} disabled />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3">
                    {isEditing ? (
                      <>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveProfile}>Save Changes</Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to receive updates and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email Alerts */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <Label htmlFor="email-alerts" className="font-medium">
                          Email Alerts
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive important updates via email
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="email-alerts"
                      checked={user.notifications.emailAlerts}
                      onCheckedChange={() => handleNotificationChange('emailAlerts')}
                    />
                  </div>

                  <Separator />

                  {/* Push Notifications */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <Label htmlFor="push-notifications" className="font-medium">
                          Push Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified on your device in real-time
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={user.notifications.pushNotifications}
                      onCheckedChange={() => handleNotificationChange('pushNotifications')}
                    />
                  </div>

                  <Separator />

                  {/* Emergency Alerts */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <Label htmlFor="emergency-alerts" className="font-medium">
                          Emergency Alerts
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Critical disaster and emergency notifications
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="emergency-alerts"
                      checked={user.notifications.emergencyAlerts}
                      onCheckedChange={() => handleNotificationChange('emergencyAlerts')}
                    />
                  </div>

                  <Separator />

                  {/* Weekly Digest */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <Label htmlFor="weekly-digest" className="font-medium">
                          Weekly Digest
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Summary of activities sent every week
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="weekly-digest"
                      checked={user.notifications.weeklyDigest}
                      onCheckedChange={() => handleNotificationChange('weeklyDigest')}
                    />
                  </div>

                  <Separator />

                  {/* Task Reminders */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <Label htmlFor="task-reminders" className="font-medium">
                          Task Reminders
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Reminders for upcoming deadlines and tasks
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="task-reminders"
                      checked={user.notifications.taskReminders}
                      onCheckedChange={() => handleNotificationChange('taskReminders')}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              {/* Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" />
                    Change Password
                  </CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" placeholder="Enter current password" />
                    </div>
                    <div />
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" placeholder="Enter new password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last changed: {user.security.lastPasswordChange}
                  </p>
                  <Button>Update Password</Button>
                </CardContent>
              </Card>

              {/* Two-Factor Authentication */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Two-Factor Authentication
                  </CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${user.security.twoFactorEnabled ? 'bg-green-100 dark:bg-green-900' : 'bg-muted'}`}>
                        <Shield className={`h-5 w-5 ${user.security.twoFactorEnabled ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {user.security.twoFactorEnabled ? '2FA is enabled' : '2FA is disabled'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.security.twoFactorEnabled
                            ? 'Your account has an extra layer of security'
                            : 'Enable 2FA to protect your account'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={user.security.twoFactorEnabled}
                      onCheckedChange={handleToggle2FA}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Login History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    Login History
                  </CardTitle>
                  <CardDescription>
                    Recent login activity on your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.security.loginHistory.map((login, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${login.status === 'success' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                            {login.status === 'success' ? (
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{login.device}</p>
                            <p className="text-xs text-muted-foreground">{login.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">{login.date}</p>
                          <Badge variant={login.status === 'success' ? 'outline' : 'destructive'} className="text-xs">
                            {login.status === 'success' ? 'Success' : 'Failed'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Organization Tab */}
            <TabsContent value="organization" className="space-y-6">
              {/* Organization Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Organization Details
                  </CardTitle>
                  <CardDescription>
                    Your NGO registration and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Organization Name</Label>
                      <Input value={user.organization.name} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Organization Type</Label>
                      <Input value={user.organization.type} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Registration Number</Label>
                      <Input value={user.organization.registrationNumber} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Website</Label>
                      <Input value={user.organization.website} disabled />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Address</Label>
                      <Input value={user.organization.address} disabled />
                    </div>
                  </div>
                  <Button variant="outline">Request Edit</Button>
                </CardContent>
              </Card>

              {/* Verification Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-primary" />
                    Verification Status
                  </CardTitle>
                  <CardDescription>
                    Your organization verification progress
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Verified Organization</p>
                        <p className="text-sm text-muted-foreground">Your NGO is fully verified</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>

                  <Separator />

                  {/* Documents Progress */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Documents Submitted</span>
                      <span className="text-sm text-muted-foreground">
                        {user.organization.documentsSubmitted}/{user.organization.documentsRequired}
                      </span>
                    </div>
                    <Progress
                      value={(user.organization.documentsSubmitted / user.organization.documentsRequired) * 100}
                    />
                  </div>

                  {/* Document List */}
                  <div className="space-y-3 pt-2">
                    {[
                      { name: 'Registration Certificate', status: 'verified' },
                      { name: 'Tax Exemption Certificate', status: 'verified' },
                      { name: 'Board Resolution', status: 'verified' },
                      { name: 'Annual Report 2025', status: 'verified' },
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">{doc.name}</span>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Upload New Document
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}
