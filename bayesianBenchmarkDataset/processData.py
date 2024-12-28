import os

def reorder(row, newOrder):
    nums = row.split()
    newRow = ' '.join([nums[i] for i in newOrder]) + '\n'
    return newRow

def processFile(filename, newOrder):
    with open(filename, 'r') as f:
        rows = f.readlines()

    newRows = [reorder(row, newOrder) for row in rows]
    newRows[-1] = newRows[-1].rstrip('\n')

    base_dir = os.path.dirname(filename)
    new_filename = os.path.join(base_dir, '..', 'child_reordered_data', os.path.basename(filename))

    os.makedirs(os.path.dirname(new_filename), exist_ok=True)

    with open(new_filename, 'w') as f:
        f.writelines(newRows)

newOrder = [0, 3, 2, 4, 12, 8, 9, 6, 7, 13, 18, 1, 14, 10, 17, 11, 5, 15, 16, 19]

processFile('child/child_data/Child_s5000_v10.txt', newOrder)