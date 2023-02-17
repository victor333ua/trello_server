export const objToArray = (columns: any[]) => {
    columns.map(column => {
        column.tasks.map((task: { list: any[]; }) => {
            const arr = task.list.map(item => item.text);
            task.list = arr;    
        })
    });
    return columns;
}