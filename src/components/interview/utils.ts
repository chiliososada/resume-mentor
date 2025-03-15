export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const statusToText = (status: number): string => {
  switch (status) {
    case 1:
      return '已批准';
    case 2:
      return '已拒绝';
    case 0:
    default:
      return '待审核';
  }
};

export const statusToEnum = (status: string): number => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 1;
    case 'rejected':
      return 2;
    case 'pending':
    default:
      return 0;
  }
};

export const enumToStatus = (statusEnum: number): 'pending' | 'approved' | 'rejected' => {
  switch (statusEnum) {
    case 1:
      return 'approved';
    case 2:
      return 'rejected';
    case 0:
    default:
      return 'pending';
  }
};