const Handlebars = require('handlebars');
const moment = require('moment');

module.exports = {
    sum: (a, b) => a + b,
    
    sortable: (field, sort) => {
        const sortType = field === sort.column ? sort.type : 'default';

        const icons = {
            default: 'fa-solid fa-sort',
            asc: 'fa-solid fa-arrow-down-short-wide',
            desc: 'fa-solid fa-arrow-up-wide-short',
        };                
        
        const types = {
            default: 'desc',
            asc: 'desc',
            desc: 'asc',
        };
        
        const icon = icons[sortType];
        const type = types[sortType];
        const href = Handlebars.escapeExpression(`?_sort&column=${field}&type=${type}`);

        const result = `<a href="${href}">
            <i class="${icon}"></i>
        </a>`;
        
        return new Handlebars.SafeString(result);
    },
    range: (start, end) => {
        const range = [];
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        return range;   
    },
    // Helper mới để kiểm tra vai trò
    ifRole: (userRole, role, options) => {
        if (userRole === role) {
            return options.fn(this); // Thực hiện block nếu đúng vai trò
        } else {
            return options.inverse(this); // Thực hiện block ngược lại nếu sai vai trò
        }
    },
    showLogout: (userRole, options) => {
        if (userRole) {
            return options.fn(this); // Thực hiện block nếu đúng vai trò
        } else {
            return options.inverse(this); // Thực hiện block ngược lại nếu sai vai trò
        }
    },
    showLogin: (userRole, options) => {
        if (userRole) {
            return options.inverse(this);
             // Thực hiện block nếu đúng vai trò
        } else {
             // Thực hiện block ngược lại nếu sai vai trò
            return options.fn(this);
        }
    },
    notShowLogin: (userRole, options) => {
        if (userRole) {
            return options.fn(this);
             // Thực hiện block nếu đúng vai trò
        } else {
             // Thực hiện block ngược lại nếu sai vai trò
             return options.inverse(this);
        }
    },
    formatDate: (date) => {
        return moment(date).fromNow(); // Ví dụ: "2 days ago"
    },
    
};
