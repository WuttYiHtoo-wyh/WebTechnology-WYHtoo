<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class NewCounselingRequest extends Notification implements ShouldQueue
{
    use Queueable;

    protected $studentName;
    protected $reason;
    protected $date;
    protected $notes;
    protected $studentEmail;

    public function __construct($studentName, $reason, $date, $notes, $studentEmail)
    {
        $this->studentName = $studentName;
        $this->reason = $reason;
        $this->date = $date;
        $this->notes = $notes;
        $this->studentEmail = $studentEmail;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        Log::info('Preparing email notification for mentor', [
            'mentor_name' => $notifiable->name,
            'mentor_email' => $notifiable->email,
            'student_name' => $this->studentName
        ]);

        $reasonMap = [
            'personal_issues' => 'Personal Issues',
            'assignment_support' => 'Assignment Support',
            'coding_issues' => 'Coding Issues'
        ];

        $formattedReason = $reasonMap[$this->reason] ?? $this->reason;
        $formattedDate = \Carbon\Carbon::parse($this->date)->format('l, F j, Y');

        return (new MailMessage)
            ->subject('New Counseling Request - Early Intervention System')
            ->greeting("Hello {$notifiable->name},")
            ->line("You have received a new counseling request from {$this->studentName}.")
            ->line('Request Details:')
            ->line("Reason: {$formattedReason}")
            ->line("Preferred Date: {$formattedDate}")
            ->line("Student Email: {$this->studentEmail}")
            ->line("Additional Notes: " . ($this->notes ?: 'No additional notes provided'))
            ->action('View Request', url('/mentor/counseling-requests'))
            ->line('Please respond to this request at your earliest convenience.')
            ->salutation('Best regards, Early Intervention System');
    }
} 