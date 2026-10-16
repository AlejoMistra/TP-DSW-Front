export interface ExpiredMembershipItemData {
  id: number;
  memberId: number;
  memberName: string;
  memberInitials: string;
  memberAvatarUrl?: string;
  planName?: string;
  daysExpired: number; // 0 = "Vence hoy", >0 = "Vencido hace Xd"
  debtAmountArs: number;
  isCritical: boolean;
}

export type ClassSessionOccupancyStatus = 'AVAILABLE' | 'NEARLY_FULL' | 'FULL';

export interface TodaySessionItemData {
  id: number;
  classScheduleId: number;
  className: string;
  instructorName: string;
  startTime: string; // "18:30"
  endTime: string;   // "19:30"
  currentCapacity: number;
  maxCapacity: number;
  occupancyStatus: ClassSessionOccupancyStatus;
  waitingListCount?: number;
}

