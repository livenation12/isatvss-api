import Activity from "../models/Activity.js"
export const inviteActivty = async (from, to) => {
          const activity = {
                    title: "Account creation invite",
                    description: `${from} has invited ${to} to use VSS`,
                    from,
                    to
          }
          const newActivity = new Activity(activity)
          return await newActivity.save()
}