export interface IColumnsType<T extends { [key: string]: any }> {
  title: React.ReactNode | ((title: T['title']) => React.ReactNode)
  dataIndex: keyof T
  key: React.Key
  render?: (value: any, record: T, index: number) => React.ReactNode
}
export interface ITableProps<T extends { [key: string]: any }> {
  columns: IColumnsType<T>
}
