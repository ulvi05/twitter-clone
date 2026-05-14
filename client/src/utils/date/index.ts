import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export const formatPostDate = (createdAt: string | Date) => {
  const createdAtDate = dayjs(createdAt);
  const now = dayjs();

  if (now.diff(createdAtDate, "day") > 1) {
    return createdAtDate.format("MMM D");
  }

  return createdAtDate.fromNow();
};

export const formatMemberSinceDate = (createdAt: string | Date) => {
  return `Joined ${dayjs(createdAt).format("MMMM YYYY")}`;
};
