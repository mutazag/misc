import argparse

def parse_opt(known=False):
    parser = argparse.ArgumentParser()
    parser.add_argument('c', nargs='?', default='courses.csv', help='path to course.csv file')
    parser.add_argument('s', nargs='?', default='students.csv', help='path to students.csv file')
    parser.add_argument('t', nargs='?', default='tests.csv', help='path to tests.csv file')
    parser.add_argument('m', nargs='?', default='marks.csv', help='path to marks.csv file')
    parser.add_argument('o', nargs='?', default='output.json', help='path to output.json file')

    return parser


if __name__ == '__main__':
    parser = parse_opt()
    args = parser.parse_args()
    print(args)