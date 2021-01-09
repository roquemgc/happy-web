import localforage from 'localforage'
import jsonWebTokenService from 'jsonwebtoken'

localforage.config({
  driver: [localforage.LOCALSTORAGE, localforage.INDEXEDDB],
  name: 'happy',
  storeName: 'happy_keys'
})

export default {
  async saveJwt(jwt: any) {
    try {
      if (jwt) {
        const decodedJwt = jsonWebTokenService.decode(jwt);
        await localforage.setItem('user_jwt', jwt);
        await localforage.setItem('user_data', decodedJwt);

        return true
      }
    } catch (err) {
        if (err instanceof jsonWebTokenService.JsonWebTokenError) return false
        throw err
    }
  },

  async getUserJwt() {
    const jwt = await localforage.getItem('user_jwt');
    return jwt;
  }
}