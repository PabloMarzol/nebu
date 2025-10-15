interface VotingNotificationsProps {
  onDismiss?: () => void;
}

export default function VotingNotifications({ onDismiss }: VotingNotificationsProps) {
  // Disable voting notifications entirely to prevent annoying popups
  return null;
}