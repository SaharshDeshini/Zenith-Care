const calculateETA = ({
  baseTime,
  peopleAhead,
  avgConsultTime,
  delayMinutes = 0,
}) => {
  const totalMinutes =
    peopleAhead * avgConsultTime + delayMinutes;

  return new Date(baseTime.getTime() + totalMinutes * 60 * 1000);
};

module.exports = { calculateETA };
