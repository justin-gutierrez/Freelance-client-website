interface ConsultationRequest {
  name: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  bookingType: 'request';
}

// In-memory storage for consultation requests (in production, use a database)
let consultationRequests: Array<{
  id: string;
  name: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}> = [];

// Helper function to add a new consultation request
export function addConsultationRequest(request: {
  id: string;
  name: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}) {
  consultationRequests.push(request);
}

// Export helper function to get consultation requests (for admin dashboard)
export function getConsultationRequests() {
  return consultationRequests;
}

// Export helper function to update consultation request status
export function updateConsultationRequestStatus(requestId: string, status: 'pending' | 'approved' | 'rejected') {
  const request = consultationRequests.find(r => r.id === requestId);
  if (request) {
    request.status = status;
  }
  return request;
} 