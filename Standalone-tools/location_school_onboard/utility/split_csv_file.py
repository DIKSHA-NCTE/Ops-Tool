# This script would split the given input csv file with 5k records per file
import os
import csv


def split(filehandler, delimiter=',', row_limit=5000, keep_headers=True):
    file_path = []
    filename = os.path.basename(filehandler).split('.')[0]
    output_name_template = filename + '_%s.csv'
    output_path = os.path.dirname(filehandler)
    reader = csv.reader(open(filehandler, 'r'), delimiter=delimiter)
    current_piece = 1
    current_out_path = os.path.join(output_path, output_name_template % current_piece)
    current_out_writer = csv.writer(open(current_out_path, 'w'), delimiter=delimiter)
    current_limit = row_limit
    if keep_headers:
        headers = next(reader)
        current_out_writer.writerow(headers)
        file_path.append(current_out_path)
    for i, row in enumerate(reader):
        if i + 1 > current_limit:
            current_piece += 1
            current_limit = row_limit * current_piece
            current_out_path = os.path.join(output_path, output_name_template % current_piece)
            current_out_writer = csv.writer(open(current_out_path, 'w'), delimiter=delimiter)
            if keep_headers:
                current_out_writer.writerow(headers)
                file_path.append(current_out_path)
        current_out_writer.writerow(row)
    return file_path

