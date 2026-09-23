<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public function __construct(public string $token) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $adminUrl = env('ADMIN_URL', 'http://localhost:5173');
        $resetUrl = "{$adminUrl}/reset-password?token={$this->token}&email=" . urlencode($notifiable->email);

        return (new MailMessage)
            ->subject('পাসওয়ার্ড রিসেট করুন — Daily News BD')
            ->greeting("হ্যালো {$notifiable->name},")
            ->line('আপনার অ্যাকাউন্টের জন্য একটা পাসওয়ার্ড রিসেট রিকোয়েস্ট এসেছে।')
            ->action('পাসওয়ার্ড রিসেট করুন', $resetUrl)
            ->line('এই লিংকটি ৬০ মিনিট পর্যন্ত কার্যকর থাকবে।')
            ->line('আপনি যদি এই রিকোয়েস্ট না করে থাকেন, এই মেইলটি উপেক্ষা করুন।');
    }
}