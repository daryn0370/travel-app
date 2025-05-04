export function setJwtCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  });
}

export function removeJwtCookie(res) {
  res.clearCookie('token', { path: '/' });
}
