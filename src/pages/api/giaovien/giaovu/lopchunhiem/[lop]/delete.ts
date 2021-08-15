import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingMessage, ServerResponse } from 'http';
import withSession from 'libs/withSession';

import prisma from 'db/prisma';

import CookieBody from 'interfaces/CookieBody';
import UserType from 'enums/UserType';

export default withSession(async function handler(req: any, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(400).end();
  const cookie_user: CookieBody = req.session.get('user');
  if (!cookie_user) return res.status(403).end();
  if (cookie_user.type !== UserType.GIAOVIEN) return res.status(403).end();
  // const id = cookie_user.id;
  const lopChuNhiem: number = Number.parseInt(req.query.lop);
  const result = await prisma.lopChuNhiem.findUnique({
    where: {
      maLopChuNhiem: lopChuNhiem,
    },
  });
  if (result === null) return res.status(404).end();

  await prisma.lopChuNhiem.delete({
    where: {
      maLopChuNhiem: lopChuNhiem,
    },
  });
  // const query = `delete from LopChuNhiem where maLopChuNhiem = ${lopChuNhiem};`;
  // await prisma.$executeRaw('DELETE from LopChuNhiem WHERE maLopChuNhiem = $1 ;', lopChuNhiem);

  res.status(200).end();
});
