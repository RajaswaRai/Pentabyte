const userRole = {
    ADMIN: 0,
    TEACHER: 1,
    STUDENT: 2,
    GUARDIAN: 3,
}
const roleMap = {
    [userRole.ADMIN]: 'admin',
    [userRole.TEACHER]: 'teacher',
    [userRole.STUDENT]: 'student',
    [userRole.GUARDIAN]: 'guardian',
};

const semesterType = {
    GANJIL: 1,
    GENAP: 2,
}
const semesterMap = {
    [semesterType.GANJIL]: 'ganjil',
    [semesterType.GENAP]: 'genap',
};

export {
    userRole, roleMap,
    semesterType, semesterMap,
}