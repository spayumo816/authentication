export const isExpiredUnverifiedResident = (user, expirationTime) => {
  if (!user) return false;

  if (user.role !== "resident") return false;

  if (user.isVerified) return false;

  if (!user.createdAt) return false;

  const isExpired =
    Date.now() - new Date(user.createdAt).getTime() > expirationTime;

  return isExpired;
};