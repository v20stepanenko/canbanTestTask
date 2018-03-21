export const getUniqueID = (length = 15) => {
    if (typeof length !== 'number') {
        throw new Error('The function argument should be a number!');
    }

    let text = '';
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};

export const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
};

export const getMonthByNum = (num) => {
    switch (num) {
        case 0: {
            return 'January';
        }
        case 1: {
            return 'February';
        }
        case 2: {
            return 'March';
        }
        case 3: {
            return 'April';
        }
        case 4: {
            return 'May';
        }
        case 5: {
            return 'June';
        }
        case 6: {
            return 'July';
        }
        case 7: {
            return 'August';
        }
        case 8: {
            return 'September';
        }
        case 9: {
            return 'October';
        }
        case 10: {
            return 'November';
        }
        case 11: {
            return 'December';
        }
        default: {
            break;
        }
    }
};

Array.prototype.clean = function () {
    return this.filter((item) => Boolean(item));
};
