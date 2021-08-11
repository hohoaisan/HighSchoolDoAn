import type { NextApiRequest, NextApiResponse } from 'next';
import withSession from 'libs/withSession';

export default withSession(async (req: any, res: NextApiResponse) => {
  req.session.destroy();
  res.json({ isLoggedIn: false });
});
