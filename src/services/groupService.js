import db from '../models/index.js';

export async function createGroup(name, groupAdminId) {
    try {
        const group = await db.Group.create({ name, groupAdminId });

        const user = await db.User.findByPk(groupAdminId);
        if (!user) {
            throw new Error('User not found');
        }

        await group.addUser(user);
        return group;
    } catch (error) {
        throw new Error('Error while creating the group: ' + error.message);
    }
}

export async function editGroup(group, newName) {
    try {
        const groupDetails = await db.Group.findByPk(group.id);
        if (!groupDetails) {
            throw new Error('Group not found');
        }
        groupDetails.name = newName;
        await groupDetails.save();
        return groupDetails;
    } catch (error) {
        throw new Error('Error while editing the group: ' + error.message);
    }
}

export async function removeGroup(group) {
    try {
        const groupDetails = await db.Group.findByPk(group.id);
        if (!groupDetails) {
            throw new Error('Group not found');
        }
        await groupDetails.destroy();
    } catch (error) {
        throw new Error('Error while removing the group: ' + error.message);
    }
}

export async function addUserToGroup(user, group) {
    try {
        user.groups = user.groups || [];
        const alreadyExist = user.groups.find(item => item.id === group.id);
        if (!alreadyExist) {
            user.groups.push(group);
        } else {
            throw new Error("User already existed in this group " + group.name);
        }

        const groupDetails = await db.Group.findByPk(group.id);
        if (!groupDetails) {
            throw new Error('Group not found');
        }

        await groupDetails.addUser(user);
        return groupDetails;
    } catch (error) {
        throw new Error('Error while adding user to group: ' + error.message);
    }
}

export async function removeUserFromGroup(user, group) {
    try {
        const userDetails = await db.User.findByPk(user.id);
        if (!userDetails) {
            throw new Error('User not found');
        }
        await db.sequelize.query(
            'DELETE FROM "UserGroup" WHERE "UserId" = $1 AND "GroupId" = $2', {
                bind: [user.id, group.id],
                type: db.sequelize.QueryTypes.DELETE
            }
        );
        return true;
    } catch (error) {
        throw new Error('Error while removing user from group: ' + error.message);
    }
}

export async function findGroupById(groupId) {
    try {
        const group = await db.Group.findByPk(groupId, {
            include: [
                { model: db.User, as: 'groupAdmin' }
            ]
        });
        return group;
    } catch (error) {
        throw new Error('Error while finding group by ID: ' + error.message);
    }
}

export async function findUserById(userId) {
    try {
        const user = await db.User.findOne({
            where: { id: userId },
            include: { model: db.Group, as: 'groups' }
        });

        return user || null;
    } catch (error) {
        console.error('Error while finding user by id:', error);
        throw error;
    }
}

export async function getUsersByGroupId(groupId) {
    try {
        const query = `
            SELECT "Users"."id", "Users"."username"
            FROM "Users"
            INNER JOIN "UserGroup" ON "Users"."id" = "UserGroup"."UserId"
            WHERE "UserGroup"."GroupId" = :groupId
        `;
        const users = await db.sequelize.query(query, {
            replacements: { groupId },
            type: db.sequelize.QueryTypes.SELECT
        });

        return users;
    } catch (error) {
        console.error('Error while fetching the users by group id:', error);
        throw new Error('Error whhile fetching the users by group id');
    }
}

export async function getUsersInGroup(user, groupId) {}