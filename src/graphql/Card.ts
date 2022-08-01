import { extendType, nonNull, objectType, stringArg, intArg } from "nexus";

export const Card = objectType({
  name: "Card",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("question");
    t.nonNull.string("answer");
    t.field("postedBy", {   // 1
      type: "User",
      resolve(parent, args, context) {  // 2
          return context.prisma.card
              .findUnique({ where: { id: parent.id } })
              .postedBy();
      },
  });
  },
});


export const CardQuery = extendType({
  type: "Query",
  definition(t) {
    // Get all cards
    t.nonNull.list.nonNull.field("allCards", {
      type: "Card",
      resolve(parent, args, context, info) {
        return context.prisma.card.findMany();
      },
    });

    // Get one card
    t.field("oneCard", {
        type: "Card",
        args: { id: nonNull(intArg()) },
        resolve(parent, args, context) {
          return context.prisma.card.findUnique({
            where: { id: args.id },
          });
        },
      });
  },
});


export const CardMutation = extendType({
  type: "Mutation",
  definition(t) {
    // create a card Q/A
    t.nonNull.field("post", {
      type: "Card",
      args: {
        question: nonNull(stringArg()),
        answer: nonNull(stringArg()),
      },

      resolve(parent, args, context) {
        const { question, answer } = args;
        const { userId } = context;

        if (!userId) {
          throw new Error("Cannot post without logging in.")
        }

        const newCard = context.prisma.card.create({
          data: {
            question,
            answer,
            postedBy: { connect: { id: userId }},
          }
        })
        return newCard;
      },
    });

    // Update the card
    t.nonNull.field("update", {
      type: "Card",
      args: {
        id: nonNull(intArg()),
        question: nonNull(stringArg()),
        answer: nonNull(stringArg()),
      },

      resolve(parent, args, context) {
        const { question, answer } = args;
        const { userId } = context;

        if (!userId) {
          throw new Error("Cannot update without logging in.")
        }

        return context.prisma.card.update({
          where: { id: args.id },
          data: {
            question: question,
            answer: answer,
          },
        });
      },
    });

    // Delete the card
    t.nonNull.field("delete", {
      type: "Card",
      args: {
        id: nonNull(intArg()),
      },

      resolve(parent, args, context) {
        const { userId } = context;

        if (!userId) {
          throw new Error("Cannot update without logging in.")
        }

        return context.prisma.card.delete({
          where: { id: args.id }
        });
      },
    });
  },
});
