#!/usr/bin/env python

import rospy
from bitbloq.srv import Position
import PyKDL as kdl
import math


class BotbloqManipulator():
    def __init__(self):
        self.chain = kdl.Chain()

        joint0 = kdl.Joint(kdl.Joint.RotZ)
        frame0 = kdl.Frame(kdl.Vector(0.0, 0.0, 0.18))
        segment0 = kdl.Segment(joint0, frame0)
        self.chain.addSegment(segment0)

        joint1 = kdl.Joint(kdl.Joint.RotX)
        frame1 = kdl.Frame(kdl.Vector(0.0, 0.0, 0.18))
        segment1 = kdl.Segment(joint1, frame1)
        self.chain.addSegment(segment1)

        joint2 = kdl.Joint(kdl.Joint.RotX)
        frame2 = kdl.Frame(kdl.Vector(0.0, 0.0, 0.18))
        segment2 = kdl.Segment(joint2, frame2)
        self.chain.addSegment(segment2)

        links = self.chain.getNrOfJoints()
        self.limit_joints = [[-math.pi / 2, math.pi / 2], [-math.pi / 2, math.pi / 2], [-math.pi / 2, math.pi / 2]]

        self.solver_fk = kdl.ChainFkSolverPos_recursive(self.chain)
        self.solver_vik = kdl.ChainIkSolverVel_pinv(self.chain)
        self.solver_ik = kdl.ChainIkSolverPos_NR(self.chain, self.solver_fk, self.solver_vik)

        self.q = kdl.JntArray(links)
        self.frame = kdl.Frame.Identity()

        self.address = [0x03, 0x04, 0x05]


    def moveJoint(self, joint, angle):
        angle = math.radians(angle)
        self.q[joint - 1] = angle

        self.solver_fk.JntToCart(self.q, self.frame)

        degrees = []
        for angle in list(self.q):
            degrees.append(math.degrees(angle))

        self.moveServo(self.address, degrees)


    def move(self, x, y, z):
        self.frame.p[0] = x
        self.frame.p[1] = y
        self.frame.p[2] = z

        self.solver_ik.CartToJnt(self.q, self.frame, self.q)

        degrees = []
        for angle in list(self.q):
            degrees.append(math.degrees(angle))

        self.moveServo(self.address, degrees)


    def canMove(self, x, y, z):
        self.frame.p[0] = x
        self.frame.p[1] = y
        self.frame.p[2] = z
        ok = True

        self.solver_ik.CartToJnt(self.q, self.frame, self.q)
        angles = list(self.q)

        for i in range(len(list(self.q))):
            if (angles[i] < self.limit_joints[i][0]) | (angles[i] > self.limit_joints[i][1]):
                ok = False

        return ok

    def moveServo(self, address, angles):
        for i in range(len(address)):
            angles[i] = angles[i] + 90.0

            rospy.wait_for_service('position_service')
            try:
                pos_srv = rospy.ServiceProxy('position_service', Position)
                resp = pos_srv(address[i], angles[i])
                print resp.response

            except rospy.ServiceException, e:
                print "Service call failed: %s" % e
