// API 응답 캐싱 시스템

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // Time to live in seconds
}

export class ApiCache {
  private cache: Map<string, CacheEntry<any>>
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    this.cache = new Map()
    this.startCleanup()
  }

  /**
   * 캐시에서 데이터 가져오기
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    // TTL 확인
    const now = Date.now()
    const age = (now - entry.timestamp) / 1000 // seconds

    if (age > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * 캐시에 데이터 저장
   * @param key 캐시 키
   * @param data 저장할 데이터
   * @param ttl TTL (초 단위)
   */
  set<T>(key: string, data: T, ttl: number = 300): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  /**
   * 특정 키 삭제
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * 패턴에 맞는 모든 키 삭제
   */
  deletePattern(pattern: string): void {
    const regex = new RegExp(pattern)
    Array.from(this.cache.keys())
      .filter(key => regex.test(key))
      .forEach(key => this.cache.delete(key))
  }

  /**
   * 모든 캐시 클리어
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * 캐시 크기 가져오기
   */
  size(): number {
    return this.cache.size
  }

  /**
   * 만료된 항목 정리 시작
   */
  private startCleanup(): void {
    // 5분마다 만료된 항목 정리
    this.cleanupInterval = setInterval(() => {
      this.removeExpired()
    }, 5 * 60 * 1000)
  }

  /**
   * 만료된 항목 제거
   */
  private removeExpired(): void {
    const now = Date.now()
    let removedCount = 0

    this.cache.forEach((entry, key) => {
      const age = (now - entry.timestamp) / 1000
      if (age > entry.ttl) {
        this.cache.delete(key)
        removedCount++
      }
    })

    if (removedCount > 0) {
      console.log(`[ApiCache] Removed ${removedCount} expired entries`)
    }
  }

  /**
   * 캐시 통계 가져오기
   */
  getStats(): {
    size: number
    oldestEntry: Date | null
    newestEntry: Date | null
    averageTTL: number
  } {
    if (this.cache.size === 0) {
      return {
        size: 0,
        oldestEntry: null,
        newestEntry: null,
        averageTTL: 0
      }
    }

    let oldest = Number.MAX_SAFE_INTEGER
    let newest = 0
    let totalTTL = 0

    this.cache.forEach(entry => {
      oldest = Math.min(oldest, entry.timestamp)
      newest = Math.max(newest, entry.timestamp)
      totalTTL += entry.ttl
    })

    return {
      size: this.cache.size,
      oldestEntry: new Date(oldest),
      newestEntry: new Date(newest),
      averageTTL: totalTTL / this.cache.size
    }
  }

  /**
   * 정리 종료
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.cache.clear()
  }
}

// Singleton 인스턴스
let cacheInstance: ApiCache | null = null

export const getApiCache = (): ApiCache => {
  if (!cacheInstance) {
    cacheInstance = new ApiCache()
  }
  return cacheInstance
}