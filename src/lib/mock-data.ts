export interface Notification {
  id: string;
  type: 'warning' | 'success' | 'danger' | 'info';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export const notifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Analysis Complete',
    body: 'Contract_Acme_2024.pdf has been successfully analyzed with a 92% compliance score.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'High Risk Detected',
    body: 'NDA_TechStart.pdf contains a high-risk clause under Intellectual Property ownership.',
    time: '4 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'New Member Joined',
    body: 'Sarah Jenkins has been added as a Compliance Manager to your organization.',
    time: '1 day ago',
    read: true,
  },
  {
    id: '4',
    type: 'danger',
    title: 'Compliance Alert',
    body: 'Service_Agreement_v2.pdf failed key GDPR compliance checks.',
    time: '2 days ago',
    read: true,
  },
  {
    id: '5',
    type: 'success',
    title: 'Report Exported',
    body: 'Q4 Compliance Audit Report has been successfully exported to PDF.',
    time: '3 days ago',
    read: true,
  },
];
