export type Todo = { id: number; name: string }

const todos: Todo[] = [
  { id: 1, name: 'Get groceries' },
  { id: 2, name: 'Buy a new phone' },
  { id: 3, name: 'Finish the project' },
]

export function getTodos(): Todo[] {
  return todos
}

export function addTodo(name: string): Todo {
  const newTodo: Todo = { id: todos.length + 1, name }
  todos.push(newTodo)
  return newTodo
}
