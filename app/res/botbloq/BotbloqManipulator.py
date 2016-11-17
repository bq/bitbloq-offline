#!/usr/bin/env python

import rospy
import kdl_parser_py.urdf as kdl_parser
import PyKDL as kdl
from sensor_msgs.msg import JointState

import math

class Manipulador():
    def __init__(self):
        (ok, tree) = kdl_parser.treeFromParam("robot_description")
        chain = tree.getChain("base_link", "link_6")
        links = chain.getNrOfJoints()

        self.solver_fk = kdl.ChainFkSolverPos_recursive(chain)
        self.solver_vik = kdl.ChainIkSolverVel_pinv(chain)
        self.solver_ik = kdl.ChainIkSolverPos_NR(chain, self.solver_fk, self.solver_vik)

        self.q = kdl.JntArray(links)
        self.frame = kdl.Frame.Identity()

        rospy.init_node('nodo_kdl')
        self.pub = rospy.Publisher('joint_states', JointState, queue_size = 10)
        self.msg = JointState()
        self.msg.name = ['joint_1', 'joint_2', 'joint_3', 'joint_4', 'joint_5', 'joint_6']
        self.pub.publish(self.msg)

    def moveJoint(self, joint, angle):
        angle = math.pi * (angle / 90.0)
        self.q[joint] = angle

        self.solver_fk.JntToCart(self.q, self.frame)
        self.msg.position = list(self.q)
        self.pub.publish(self.msg)

    def move(self, x, y, z):
        self.frame.p[0] = x
        self.frame.p[1] = y
        self.frame.p[2] = z

        self.solver_ik.CartToJnt(self.q, self.frame, self.q)
        self.msg.position = list(self.q)
        self.pub.publish(self.msg)