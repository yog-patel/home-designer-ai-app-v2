import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const USER_ID_KEY = '@homeai_user_id';
const USAGE_CACHE_KEY = '@homeai_usage';

export const getUserId = async (): Promise<string> => {
  try {
    let userId = await AsyncStorage.getItem(USER_ID_KEY);
    if (!userId) {
      userId = uuidv4();
      await AsyncStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return uuidv4();
  }
};

export const getUsageData = async (userId: string) => {
  try {
    const cacheKey = `${USAGE_CACHE_KEY}_${userId}`;
    return await AsyncStorage.getItem(cacheKey);
  } catch (error) {
    console.error('Error getting usage data:', error);
    return null;
  }
};

export const setUsageData = async (userId: string, data: any) => {
  try {
    const cacheKey = `${USAGE_CACHE_KEY}_${userId}`;
    await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (error) {
    console.error('Error setting usage data:', error);
  }
};
