import { SearchHistoryItem } from '@/interfaces/SearchHistoryItem'

class SearchHistoryService {
  private localStorage: Storage
  private static readonly ARRAY_KEY = 'search_history'

  constructor () {
    this.localStorage = window.localStorage
  }

  get (): Array<SearchHistoryItem> {
    return JSON.parse(this.localStorage.getItem(SearchHistoryService.ARRAY_KEY) || '[]')
  }

  add (key: string): boolean {
    try {
      const searchHistoryList = this.get()
      const newItem: SearchHistoryItem = {
        value: key,
        timestamp: Date.now()
      }
      searchHistoryList.push(newItem)
      this.localStorage.setItem(SearchHistoryService.ARRAY_KEY, JSON.stringify(searchHistoryList))
      return true
    } catch (e) {
      return false
    }
  }

  remove (key: string): boolean {
    try {
      let searchHistoryList = this.get()
      searchHistoryList = searchHistoryList.filter((item) => {
        return item.value !== key
      })
      this.localStorage.setItem(SearchHistoryService.ARRAY_KEY, JSON.stringify(searchHistoryList))
      return true
    } catch (e) {
      return false
    }
  }

  clear () {
    this.localStorage.removeItem(SearchHistoryService.ARRAY_KEY)
  }
}

export default SearchHistoryService
