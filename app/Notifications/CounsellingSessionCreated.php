<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CounsellingSessionCreated extends Notification implements ShouldQueue
{
    use Queueable;

    protected $counselling;

    public function __construct($counselling)
    {
        $this->counselling = $counselling;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $isMentor = $notifiable->role === 'mentor';
        $subject = $isMentor 
            ? 'New Counselling Session Scheduled'
            : 'Your Counselling Session Has Been Scheduled';

        return (new MailMessage)
            ->subject($subject)
            ->line('A new counselling session has been scheduled.')
            ->line('Ticket ID: ' . $this->counselling->ticket_id)
            ->line('Date: ' . $this->counselling->date)
            ->line('Notes: ' . $this->counselling->notes)
            ->line($isMentor 
                ? 'Student: ' . $this->counselling->student->name
                : 'Mentor: ' . $this->counselling->mentor->name)
            ->action('View Details', url('/counselling/' . $this->counselling->id))
            ->line('Thank you for using our counselling system!');
    }
} 